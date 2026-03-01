import CameraRoll from "@/components/CameraRoll";
import Contacts from "@/components/Contacts";
import Header from "@/components/Header";
import Specialty from "@/components/Specialty";
import PhotoList from "@/components/PhotoList";
import Frame from "@/components/Logo-Frame";
import Image from "next/image";


export default async function Home() {
    

  return (
    <div className="flex flex-col items-center overflow-hidden">
      
      <header id="hero" className="w-full mx-auto">
        <Header/>
      </header>

      <section id="about-me">
        <Specialty/>
      </section>

      <main>
        
        <section id="my-work" className="w-full bg-neutral-200">

        <Image src="/images/torn-paper-divider-lower.png" alt="page divider" width={1200} height={80} className="w-full h-auto" />
          
          <Frame text="Foto" route="/foto" />
          <PhotoList/>

          <Image src="/images/torn-paper-divider-upper.png" alt="page divider" width={1200} height={80} className="w-full h-auto" />
          
        </section>

        <section className="bg-neutral-200">
          <Image src="/images/torn-paper-divider-lower.png" alt="page divider" width={1200} height={80} className="w-full h-auto" />

          <Frame text="Video" route="/videos" />
          
          <div>
            <CameraRoll rotate={2} />
            <CameraRoll rotate={-2} />
            <CameraRoll rotate={2} />
          </div>

          <Image src="/images/torn-paper-divider-upper.png" alt="page divider" width={1200} height={80} className="w-full h-auto" />

        </section>
      </main>

      

      <footer id="contacts" className="w-full bg-neutral-200" >
        <Image src="/images/torn-paper-divider-lower.png" alt="page divider" width={1200} height={80} className="w-full h-auto" />
        <Contacts/>
      </footer>
      
    </div>
    
  );
}

