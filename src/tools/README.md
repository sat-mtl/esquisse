# SAT Tools Diagram

## Forking Nadieh Bremer's Hacking a chord diagram to visualize a flow

https://www.visualcinnamon.com/2015/08/stretched-chord/#code-for-all-intermediate-steps

https://gist.github.com/nbremer/c11409af47b5950f0289

Final step (number 6) from Nadieh Bremer's blog on [How to create a Flow diagram with a circular Twist](http://www.visualcinnamon.com/2015/08/stretched-chord.html) in which the Chord Diagram is now officially a circular flow diagram and the chords have been sorted to reduce overlap. An example based on actual data can be found [here](http://bl.ocks.org/nbremer/f9dacd23eece9d23669c)

## Notes on data

### Tool categories

Defined in [src/tools/categories.csv](src/tools/categories.csv):
* colors are defined with [d3-scale-chromatic schemeTableau10](https://github.com/d3/d3-scale-chromatic#schemeTableau10)

### Tools

Defined in: [src/tools/tools.csv](src/tools/tools.csv): 
* please keep tools ordered and grouped by category (otherwise categories may appear multiple times)
* the first tool of a given category in the csv file will be the closest to the category label in the visualization, so this should be the flagship tool of a category (for example Splash for Projection mapping)
