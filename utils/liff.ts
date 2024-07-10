import liff from "@line/liff";

export const initLiff = async () => {
    try {
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID as string;
        if (!liffId) {
            throw new Error("LIFF ID is not defined. Check your environment variables.");
        }

        await liff.init({ liffId });
        if (!liff.isLoggedIn()) {
            liff.login();
        }
    } catch (error) {
        console.error("liff init error", error);
    }
};
