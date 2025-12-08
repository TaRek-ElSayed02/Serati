import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        Home
      </main>
      <Footer />
    </div>
  );
}
