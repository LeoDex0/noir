import type { StaticImageData } from "next/image";

import heroPour from "@/photos/hero-pour.jpg";
import courseOyster from "@/photos/course-oyster.jpg";
import courseLangoustine from "@/photos/course-langoustine.jpg";
import courseSaffron from "@/photos/course-saffron.jpg";
import courseConsomme from "@/photos/course-consomme.jpg";
import coursePassion from "@/photos/course-passion.jpg";
import courseRaspberry from "@/photos/course-raspberry.jpg";
import philoMushrooms from "@/photos/philo-mushrooms.jpg";
import philoSalts from "@/photos/philo-salts.jpg";
import philoStilllife from "@/photos/philo-stilllife.jpg";
import chefPortrait from "@/photos/chef-portrait.jpg";
import chefPlating from "@/photos/chef-plating.jpg";
import chefSalt from "@/photos/chef-salt.jpg";
import chefFire from "@/photos/chef-fire.jpg";
import chefSteam from "@/photos/chef-steam.jpg";
import chefTweezers from "@/photos/chef-tweezers.jpg";
import spaceStone from "@/photos/space-stone.jpg";
import spaceCounter from "@/photos/space-counter.jpg";
import spaceCandle from "@/photos/space-candle.jpg";
import spaceGlasses from "@/photos/space-glasses.jpg";
import galCrudo from "@/photos/gal-crudo.jpg";
import galPavlova from "@/photos/gal-pavlova.jpg";
import galSauce from "@/photos/gal-sauce.jpg";
import galSmoke from "@/photos/gal-smoke.jpg";
import galGarlic from "@/photos/gal-garlic.jpg";
import galOysters from "@/photos/gal-oysters.jpg";
import galPan from "@/photos/gal-pan.jpg";
import galTable from "@/photos/gal-table.jpg";
import galLantern from "@/photos/gal-lantern.jpg";
import galFinger from "@/photos/gal-finger.jpg";
import endFlame from "@/photos/end-flame.jpg";
import courseEmber from "@/photos/course-ember.jpg";
import galScallop from "@/photos/gal-scallop.jpg";
import galDarkDessert from "@/photos/gal-darkdessert.jpg";
import galPlate from "@/photos/gal-plate.jpg";
import galKnife from "@/photos/gal-knife.jpg";
import roomCellar from "@/photos/room-cellar.jpg";
import roomArch from "@/photos/room-arch.jpg";
import roomPrivate from "@/photos/room-private.jpg";
import detailWall from "@/photos/detail-wall.jpg";
import chefKnife from "@/photos/chef-knife.jpg";

export type Photo = { src: StaticImageData; alt: string };

const p = (src: StaticImageData, alt: string): Photo => ({ src, alt });

export const photos = {
  hero: p(heroPour, "A cook's spoon pours a glossy jus over a plated course on a white plate, lit by a single warm light in a dark room"),

  saffron: p(courseSaffron, "Seared scallops with caviar, asparagus and a golden saffron butter sauce on a black plate"),
  ember: p(courseEmber, "Slices of rare aged beef with charred green beans, potato and a pale purée on a dark stone plate"),
  oyster: p(courseOyster, "A single opened oyster resting on a dark blue-black surface"),
  langoustine: p(courseLangoustine, "Raw langoustine with pumpkin purée, herbs and flowers on a dark textured stoneware plate"),
  consomme: p(courseConsomme, "Top view of a clear amber consommé with a single flower, between a fork and a knife on black"),
  plums: p(coursePassion, "Three wrinkled smoked plums and a blackcurrant leaf in a black bowl on grey slate"),
  raspberry: p(courseRaspberry, "A raspberry dessert under a fall of frozen milk powder, surrounded by raspberries on a dark table"),

  mushrooms: p(philoMushrooms, "A cluster of small brown mushrooms reflected on a black surface"),
  salts: p(philoSalts, "Three antique spoons holding coarse salt, pink salt and peppercorns on dark veined stone"),
  stilllife: p(philoStilllife, "Squashes, mandarins and a bowl of fruit on a dark wooden table in low side light"),

  chefPortrait: p(chefPortrait, "A chef in a dark jacket stands in shadow, holding a finished plate into the light"),
  chefPlating: p(chefPlating, "Tattooed forearms of a cook placing herbs on a row of plates with a spoon"),
  chefSalt: p(chefSalt, "A cook's hands scattering salt through a beam of light"),
  chefFire: p(chefFire, "Flames rise from a pan as a cook tosses it over the stove"),
  chefSteam: p(chefSteam, "Steam rising from a pan in a dark kitchen"),
  chefTweezers: p(chefTweezers, "A cook uses tweezers and a spoon to finish a plate with a golden sphere"),

  stone: p(spaceStone, "A dim dining room with rough stone walls, tall windows and set tables"),
  counter: p(spaceCounter, "A long wooden counter set with napkins and glasses, lit low"),
  candle: p(spaceCandle, "A candle, a wine glass and plates on a laid table"),
  glasses: p(spaceGlasses, "Wine glasses and a tealight on a dark table at night"),

  crudo: p(galCrudo, "Raw fish with tomato and flowers on a dark stoneware plate, a dessert behind it"),
  pavlova: p(galPavlova, "A broken meringue with blackberries and dark berry juice on a black plate"),
  sauce: p(galSauce, "A cook spooning red sauce onto meat in a pale stone bowl"),
  smoke: p(galSmoke, "Smoke drifting over a dish of fruit and a terracotta cloth in darkness"),
  garlic: p(galGarlic, "Three roasted garlic bulbs scattered on black"),
  oysters: p(galOysters, "A close view of a pile of rough oyster shells"),
  pan: p(galPan, "A pan bursting into flame on a gas stove in a dark kitchen"),
  table: p(galTable, "A rustic table with a wine glass, a pear, bread and butter in low light"),
  finger: p(galFinger, "A cook's finger adjusting a garnish in a white bowl on an oak counter"),

  scallop: p(galScallop, "Close view of scallops topped with caviar in saffron butter"),
  darkDessert: p(galDarkDessert, "A dark chocolate dessert with small meringues on a black plate"),
  plate: p(galPlate, "A colourful plated course with flowers and root vegetables on grey stoneware over black marble"),
  knife: p(galKnife, "A paring knife balanced upright on a fingertip against black"),
  lantern: p(galLantern, "An iron lantern with a candle on a pale stone wall"),
  cellar: p(roomCellar, "A vaulted stone cellar with long candlelit tables set for dinner"),
  arch: p(roomArch, "A whitewashed stone arch opening onto a dim room with a single table and chair"),
  private: p(roomPrivate, "A small stone room with a wooden table, candles and a narrow door"),
  wall: p(detailWall, "Rough limestone wall lit by two small brass lamps"),
  chefKnife: p(chefKnife, "A chef's knife resting on a dark worn wooden board"),
  flame: p(endFlame, "A tall flame in a dark kitchen"),
} satisfies Record<string, Photo>;
