import Contributor from "@/components/ui/contributor"
import Image from "next/image"

export default function About() {
    return (
      <div className="flex flex-col">
        <Image
          className="object-cover w-full min-h-80 max-h-80"
          src="/uci.webp"
          alt="An Image of UCI's signage."
          width={2000}
          height={2000}
        />
        <div className="flex p-8 gap-6 justify-between" id="about-content">
          <div className="flex flex-col" id="about-text">
            <div className="flex gap-4 items-center mb-2" id="about-header">
              <h1 className="text-3xl font-bold" id="about-title">About ZotMeal</h1>
              <Image
                src="/ZotMeal-Logo.webp"
                alt="Zotmeal's logo"
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>
            <div id="about-paragraph" className="grid gap-4 max-w-3xl max-md:max-w-2xl">
              <p>
                ZotMeal is your go-to app for everything dining at UCI! From 
                up-to-date menus and nutritional information to dining hall 
                events and meal ratings, we make it easy to plan your next meal.
                Built by students, for students, our goal is to make campus 
                dining more accessible and user-friendly.
              </p>
              <p>
                This project is proudly developed and maintained by&nbsp;
                <a className="underline text-sky-600" href="https://studentcouncil.ics.uci.edu/" rel="noreferrer">
                  ICS Student Council
                </a>.
                As one of ICSSC's smaller teams, we're a tight-knit 
                group passionate about improving student life through 
                technology.
              </p>
              <p>
                Want to contribute? ZotMeal is open-source, and we welcome 
                contributions on our&nbsp; 
                <a className="underline text-sky-600" href="https://github.com/icssc/ZotMeal" rel="noreferrer">GitHub</a>! 
                Have questions or ideas? Join the conversation on our&nbsp; 
                 <a className="underline text-sky-600" href="https://discord.gg/GzF76D7UhY">
                  Discord
                 </a>!
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4" id="contributors">
            <h1 className="text-xl max-md:text-base max-sm:text-sm font-bold">Our Lovely Contributors</h1>
            <div className="flex flex-wrap justify-center gap-2 max-w-xs" id="contributor-grid">
              {[...Array(20)].map((_, index) => (
                <Contributor 
                  key={"contributor-" + index}
                  name="Jacob Moy"
                  username="EightBitByte" 
                  profileSrc="/peter.webp" 
                  bio="Computer Science @ UCI | Game & Software Developer"/>
              ))}
            </div>
            <p className="text-sm italic font-light text-zinc-500">.. you could be here!</p>
          </div>
        </div>
      </div>
    )
}