"use client";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center gap-1">
            ออกจากระบบแล้ว{" "}
            <a className="text-blue-400 underline" href="/login">
                เข้าสู่ระบบ
            </a>
        </div>
    );
}
