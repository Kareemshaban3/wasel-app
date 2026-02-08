import React from "react";
import Hero from "../Hero";
import EnjoyLearning from "../EnjoyLearning";
import HoneYourSkills from "../HoneYourSkills";
import Reviews from "../Reviews";
import PopularCoursesSection from "../PopularCoursesSection";
import ProgressWithWasel from "../ProgressWithWasel";

function Home() {
  return (
    <>
      <Hero />

      <EnjoyLearning />
      <HoneYourSkills />
      <Reviews />

      <PopularCoursesSection />

      <ProgressWithWasel />
    </>
  );
}

export default Home;
