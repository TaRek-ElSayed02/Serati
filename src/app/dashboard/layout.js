import AuthSessionProvider from "../components/SessionProvider";
import QueryProvider from "../providers";
import Sidebar from "../components/Sidebar/Sidebar";

export const metadata = {
  title: "سيرَتي",
  description: "يمكنك انشاء سيرة ذاتيه احترافيه من خلال موقعنا !",
};

export default function DashboardLayout({ children }) {
  return (
    <div style={{ direction: "rtl", textAlign: "right" }}>
      <AuthSessionProvider>
        <QueryProvider>
          <main>{children}</main>
          <Sidebar />
        </QueryProvider>
      </AuthSessionProvider>
    </div>
  );
}
