import { ReactNode } from "react";
import BottomNavBar from "@/components/BottomNavBar";

interface Props {
  children: ReactNode;
}

export default function NavBarLayout({ children }: Props) {
  return (
    <>
      <main className="pb-20">{children}</main>
      <BottomNavBar />
    </>
  );
}
