"use client";

import React from "react";
import Image from "next/image";
import { IAnimeInfo, ISearch } from "@consumet/extensions";
import {
  Bookmark,
  Calendar,
  Folder,
  Info,
  PlayCircle,
  Tv,
  Youtube,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Autoplay, Mousewheel } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import { cleanHTML, cn, getAnimeTitle } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { H3, H4, Small } from "@/components/ui/topography";
// Import Swiper styles
import "swiper/swiper.min.css";

interface HeroProps {
  trending: ISearch<IAnimeInfo>;
}

const Hero = ({ trending }: HeroProps) => {
  const { status } = useSession();

  const progressRef = React.useRef<HTMLDivElement>(null);

  const autoplayProgressHandler = (_: any, __: any, percentage: number) => {
    if (progressRef.current) {
      progressRef.current.style.width = `${100 - percentage * 100}%`;
    }
  };

  return (
    /* main wrapper */
    <section className="flex w-full flex-col gap-4 py-3 md:flex-row md:py-6">
      <div className="relative h-44 w-full rounded-lg md:h-[18rem] md:w-3/4 lg:h-[24rem]">
        {trending && (
          <Swiper
            className="h-full"
            slidesPerView={1}
            modules={[Autoplay, Mousewheel]}
            loop={true}
            mousewheel={true}
            autoplay={{
              delay: 3000,
              pauseOnMouseEnter: true,
            }}
            onAutoplayTimeLeft={autoplayProgressHandler}
          >
            {trending.results.slice(0, -4).map((anime) => {
              return (
                <SwiperSlide key={anime.id} className="rounded-lg">
                  <Image
                    priority
                    src={anime.cover ?? ""}
                    alt={getAnimeTitle(anime)}
                    width={1440}
                    height={810}
                    className="absolute -z-10 h-full rounded-lg object-cover opacity-50"
                  />

                  <div className="relative flex h-full w-full rounded-lg bg-gradient-to-tr from-black to-transparent">
                    <div className="relative flex w-3/4 flex-col gap-1 px-5 py-2 md:py-5 lg:p-10">
                      {/* title */}
                      <Tooltip>
                        <TooltipTrigger>
                          <H3 className="truncate text-start font-bold">
                            {getAnimeTitle(anime)}
                          </H3>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <H4 fontInter>{getAnimeTitle(anime)}</H4>
                        </TooltipContent>
                      </Tooltip>

                      {/* description */}
                      <Small className="line-clamp-3 md:line-clamp-[6] lg:line-clamp-[7]">
                        {cleanHTML(anime.description ?? "")}
                      </Small>

                      {/* meta */}
                      <div className="absolute bottom-16 flex place-items-center items-center gap-0.5 font-semibold md:bottom-20 lg:bottom-24">
                        {/* anime type */}
                        <MetaPara>
                          <Tv size={16} />
                          {anime.type ?? "N/A"}
                        </MetaPara>

                        {/* total episodes */}
                        <MetaPara>
                          <Folder size={16} />
                          {anime.totalEpisodes === 1
                            ? "1 Episode"
                            : `${anime.totalEpisodes} Episodes` ?? "N/A"}
                        </MetaPara>

                        {/* anime release date */}
                        <MetaPara>
                          <Calendar size={16} />
                          {anime.releaseDate ?? "N/A"}
                        </MetaPara>
                      </div>

                      <div className="absolute bottom-4 flex w-full gap-2 font-bold tracking-tight md:bottom-6 md:gap-3 lg:bottom-8 lg:text-lg">
                        {/* play button */}
                        <Button
                          variant="green"
                          className="h-9 gap-1 px-2 md:h-10 md:px-2 lg:h-10 lg:px-4"
                        >
                          <PlayCircle className="h-5 w-5 md:h-6 md:w-6" />
                          Play
                        </Button>

                        {/* youtube trailer button */}
                        <Button
                          variant="destructive"
                          className="h-9 gap-1 px-2 md:h-10 md:px-2 lg:h-10 lg:px-4"
                        >
                          <Youtube className="h-5 w-5 md:h-6 md:w-6" />
                        </Button>

                        {/* add to watchlist button */}
                        {status == "authenticated" && (
                          <Button className="h-9 gap-1 px-2 md:h-10 md:px-2 lg:h-10 lg:px-4">
                            <Bookmark className="h-5 w-5 md:h-6 md:w-6" />
                          </Button>
                        )}

                        {/* more info button */}
                        <Button className="ml-auto mr-8 h-9 gap-1 px-2 md:h-10 md:px-2 lg:mr-14 lg:h-10 lg:px-4">
                          <Info className="h-5 w-5 md:h-6 md:w-6" />
                        </Button>
                      </div>
                    </div>

                    <div className="relative h-full w-1/4 rounded-lg p-1">
                      <div className="flex h-full w-full items-center justify-center rounded-md p-1 backdrop-blur-md md:p-2 lg:px-5 lg:py-3">
                        <div className="group h-full w-full overflow-hidden rounded-md">
                          <Image
                            src={anime.image ?? ""}
                            alt={getAnimeTitle(anime)}
                            width={480}
                            height={270}
                            className="h-full rounded-md object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}

        {/* autoplay progress */}
        <div
          ref={progressRef}
          className="absolute bottom-0 z-10 h-1 rounded-b-md bg-red-500"
        />
      </div>

      {/* anime grid */}
      <div className="grid h-32 w-full grid-cols-2 justify-between gap-2 rounded-lg md:flex md:h-[18rem] md:w-1/4 md:flex-col lg:h-[24rem]">
        {trending.results.slice(-4).map((anime) => {
          return (
            <Small
              key={anime.id}
              className="group relative flex h-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-tr from-gray-900 to-transparent text-center font-bold"
            >
              <Image
                src={anime.image ?? ""}
                alt={getAnimeTitle(anime)}
                width={480}
                height={270}
                className="absolute -z-10 h-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-110"
              />

              {getAnimeTitle(anime)}
            </Small>
          );
        })}
      </div>
    </section>
  );
};

export default Hero;

const MetaPara = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        "flex gap-0.5 rounded bg-transparent px-1 text-sm tracking-tight backdrop-blur-md md:gap-1 md:px-2",
        className
      )}
    >
      {children}
    </p>
  );
};
