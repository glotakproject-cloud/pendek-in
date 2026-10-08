import { PublicNavbar } from "@/components/layouts/public-navbar";
import { PublicFooter } from "@/components/layouts/public-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <PublicNavbar />
      <div className="flex-1">
        {children}
      </div>
      <PublicFooter />
    </div>
  );
}
