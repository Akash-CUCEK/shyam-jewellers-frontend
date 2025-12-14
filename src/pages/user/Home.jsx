import React from "react";
import Carousel from "../../components/users/Carousel";
import CategoryGrid from "../../components/users/CategoryGrid";
import CollectionGrid from "../../components/users/CollectionGrid";
import CuratedGenderSection from "../../components/users/CuratedGenderSection";
import JewelleryOccasions from "../../components/users/JewelleryOccasions";
import ShyamaExperience from "../../components/users/ShyamaExperience";

function Home() {
  return (
    <div>
      <Carousel />
      <CollectionGrid />
      <CategoryGrid />
      <JewelleryOccasions />
      <CuratedGenderSection />
      <ShyamaExperience />
    </div>
  );
}

export default Home;
