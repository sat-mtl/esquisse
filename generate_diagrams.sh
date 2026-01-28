#!/bin/bash

sedopts="s/<a xlink:href/<a target=\"blank_\" xlink:href/g"
dvisvgmopts="--font-format=woff --linkmark=none "

pushd images

latex logiciels_thematiques.tex && \
dvisvgm $dvisvgmopts logiciels_thematiques.dvi -o ../public/fr/logiciels_thematiques.svg && \
sed -i "$sedopts" ../public/fr/logiciels_thematiques.svg 

latex logiciels_thematiques-en.tex && \
dvisvgm $dvisvgmopts logiciels_thematiques-en.dvi -o ../public/en/logiciels_thematiques.svg && \
sed -i "$sedopts" ../public/en/logiciels_thematiques.svg 

popd
