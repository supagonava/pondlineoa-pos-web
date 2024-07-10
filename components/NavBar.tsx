import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { BiArrowBack } from "react-icons/bi";
import { MdFoodBank } from "react-icons/md";

const NavBar = () => {
    const router = useRouter();
    const pathName = usePathname();
    const { user } = useAuth();

    return (
        <nav className="h-[80px] bg-primary">
            <div className="flex flex-col items-center justify-center h-full">
                <div className="flex justify-between w-full p-2">
                    <div className="w-1/5 justify-center flex flex-col">
                        {!["/restaurant", "/users", "/login"].includes(pathName) && (
                            <Button className="w-[50px]" rounded onClick={() => router.back()} severity="info" size="small">
                                <BiArrowBack />
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-1 justify-center w-2/5">
                        <Image className="rounded-full" width={50} height={50} src="/icon.webp" alt="icon"></Image>
                        <h3 className="text-lg text-white truncate">{user?.restaurant?.name}</h3>
                    </div>
                    <div className="w-1/5"></div>
                </div>
            </div>
        </nav>
    );
};
export default NavBar;
