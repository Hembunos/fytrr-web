// lib/env-check.ts
export const checkEnvVars = () => {
  const required = [
    "RAZORPAY_KEY_ID",
    "RAZORPAY_KEY_SECRET",
    "NEXT_PUBLIC_RAZORPAY_KEY_ID",
  ];

  required.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Critical Environment Variable Missing: ${key}`);
    }
  });
};

// ADDED: onCancel parameter to handle UI state reset
export const handlePayment = async (
  registrationId: string,
  onCancel: () => void
) => {
  try {
    // 1. Create Order
    const orderRes = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registration_id: registrationId }),
    });

    const order = await orderRes.json();
    if (!order.id) throw new Error("Payment server busy");

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "FYTRR Event",
      order_id: order.id,
      handler: async function (response: any) {
        // 2. Verify Payment
        const verifyRes = await fetch("/api/razorpay/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            registration_id: registrationId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        const result = await verifyRes.json();
        if (result.success) {
          window.location.href = "/dashboard?success=true";
        } else {
          alert("Payment verification failed. Please check your dashboard.");
          onCancel(); // Reset loading if verification fails
        }
      },
      modal: {
        ondismiss: () => {
          // MODIFIED: Call onCancel instead of hard reloading the page
          // This allows the user to try again without losing their form data
          onCancel();
        },
      },
      theme: { color: "#000000" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Checkout Error:", error);
    onCancel(); // Reset loading on network or server errors
    throw error;
  }
};
