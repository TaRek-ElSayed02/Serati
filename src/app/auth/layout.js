import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import AuthSessionProvider from "../components/SessionProvider";

export const metadata = {
  title: "سيرَتي",
  description: "يمكنك انشاء سيرة ذاتيه احترافيه من خلال موقعنا !",
};

export default function RootLayout({ children }) {
  return (

        <div>
          <AuthSessionProvider>
            <Navbar />
            {children}
            <Footer />
          </AuthSessionProvider>
        </div>

  );
}
