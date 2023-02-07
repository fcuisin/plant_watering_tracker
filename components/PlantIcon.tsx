import Aloevera from "../public/aloevera.png";
import Passiflora from "../public/passiflora.png";
import Cactus from "../public/cactus.png";
import Bonsai from "../public/bonsai.png";
import Grass from "../public/grass.png";
import Salicorne from "../public/salicorne.png";
import Buttercup from "../public/buttercup.png";
import Tulip from "../public/tulip.png";
import Vine from "../public/vine.png";
import Sunflower from "../public/sunflower.png";
import Waterlily from "../public/waterlily.png";
import Terrarium from "../public/terrarium.png";

import Image from "next/image";

export const listOfIcons = {
  aloevera: Aloevera,
  passiflora: Passiflora,
  cactus: Cactus,
  bonsai: Bonsai,
  grass: Grass,
  salicorne: Salicorne,
  buttercup: Buttercup,
  tulip: Tulip,
  vine: Vine,
  sunflower: Sunflower,
  waterlily: Waterlily,
  terrarium: Terrarium,
};

export default function PlantIcon({
  icon,
  size = 100,
}: {
  icon: string;
  size?: number;
}) {
  return (
    <Image src={listOfIcons[icon]} alt={icon} width={size} height={size} />
  );
}
