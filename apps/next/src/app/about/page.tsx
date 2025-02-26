import Image from "next/image"

export default function About() {
    return (
        <Image
            className="object-cover w-full min-h-80 max-h-80"
            src="/uci.webp"
            alt="An Image of UCI's signage."
            width={2000}
            height={2000}
        />
    )
}