# La Théorie Gaia

## Description du projet

À travers ce projet, nous cherchons à montrer que l'augmentation du taux de CO~2~ dans l'atmosphère ainsi que de la température mondiale a un impact sur le nombre de catastrophes naturelles qui se produisent sur le globe.
Pour cela, nous avons conçu un site web contenant une carte du monde offrant une vue globale et des graphiques de tendance pour chaque pays.

Nous utilisons quatre sets de données provenant de sources différentes (indiquées plus bas). Le premier concerne la température dans chaque pays au cours des 100 dernières années, le second recense toutes les catastrophes survenues dans le monde depuis 1900 et les deux derniers contiennent les taux de CO~2~ mondial entre 1900 et 1958 pour le premier, puis entre 1958 et 2018 pour le second. Le premier set de données de CO~2~ a des données annuelles tandis que le second et celui des températures ont des données mensuelles.

Le projet ne nécessite pas de serveur, il suffit de lancer le fichier ```index.html``` à la racine du projet.

### Public cible

Notre public cible est majoritairement les climatosceptiques pour leur montrer que le réchauffement climatique est réel et que cela a un impact, mais aussi toute autre personne souhaitant s'informer sur le sujet.

### Sources de données

- Températures : Earth Surface Temperature Data, https://www.kaggle.com/berkeleyearth/climate-change-earth-surface-temperature-data
- Catastrophes : EM-DAT, CRED / UCLouvain, Brussels, Belgium, https://public.emdat.be/
- CO2 (1958-2018) : Mauna Loa Observatory, Hawaii, https://datahub.io/core/co2-ppm/r/0.html
- CO2 (1900-1958) : Ice-Core Data, https://data.giss.nasa.gov/modelforce/ghgases/Fig1A.ext.txt

### Membres du groupe

 - Favre Alexandre
 - Mendes Lourenço Miguel
 - Riondet Guillaume
 - von der Weid Joël

## Partie visualisation de l'information

Le projet est séparé en deux type de visualisations : une carte du monde affichant les températures et les catastrophes du mois sélectionné, ainsi que des line charts montrant la corrélation entre température et catastrophes, température et taux de CO~2~ et enfin taux de CO~2~ et catastrophes, le tout au cours du temps.

### Carte du monde

La carte du monde est la vue d'accueil du site. Il s'agit d'une carte de chaleur représentant la température des pays du monde durant le mois sélectionné. Un curseur permet de choisir l'année et le mois à afficher entre 1900 et 2013 qui sont les bornes de nos sets de données. Un bouton d'animation permettant de faire défilé les mois et de voir l'évolution en direct est aussi disponible.
Un filtre permet de choisir quels types de catastrophes afficher afin de voir lesquelles sont le plus liées aux changements de température.

Le choix d'utiliser cette représentation est qu'elle est très visuelle et permet d'avoir une vision globale. C'est également une représentation plus attractive que des graphiques permettant d'attirer le regard et d'intéresser les visiteurs du site, qui pourront ensuite cliquer sur un pays pour afficher les graphiques de tendances donnant des données plus précises sur le temps.  L'animation permettant de visualiser l'évolution des critères selectionnés au cours du temps en fixant le mois de l'année permet de suivre l'évolution sur une période de l'année.

Deux critères sont représentés, par pays, sur cette carte :
 - la température moyenne
 - la présence de catastrophe naturelle 

La température est représentée à l'aide de couleur allant du bleu foncé, pour le froid (-30°C), au rouge pour le chaud (+60°C). 
La présence de catastrophe naturelle est représentée à l'aide d'un rond plein noir situé au centre du pays pour indiquer qu'une catastrophe naturelle a eu lieu sur le territoire du pays au cours du mois sélectionné.

La vue mercator choisie pour la repésentation du monde permet une conservation des angles mais pas des distances. L'optique recherchée ici est d'offrir une visualisation simple du monde dans sa globalité. Les aspects distanciels ne sont pas requis pour la bonne compréhension du message, seul l'organisation et la forme des pays est nécéssaire. La vue mercator fournit donc ici une vue souvent utilisée pour la représentation du monde ce qui l'a rend rapidement compréhensible pour tout le public visé.

La carte possède deux formes d'interaction au niveau de chaque pays :
 - Le survol de la souris
 - Le clic de la souris

Le survol de la souris sur un pays permet de récupérer le nom du pays et la température du mois sélectionné. Le clic de la souris permet d'obtenir un niveau de détail supplémentaire en redirigeant l'utilisateur sur la page des line charts détaillée ci-après.

### Line charts

Il y a trois graphiques pour chaque pays.
Le premier graphique représente l'évolution du taux de CO~2~ et du nombre de catastrophes au cours des mois. Il contient une courbe du taux de CO~2~ et des points représentant le nombre de catastrophes durant chaque mois.
Le second représente l'évolution de la température et du nombre de catastrophes au cours des mois. Il contient une courbe de température, une courbe de tendance de la température qui est une moyenne annuel et des points représentant le nombre de catastrophes durant chaque mois.
Le dernier graphique représente l'évolution de la température et du taux de CO~2~ pour pouvoir comparer leur évolution au cours des mois.

Le choix d'utiliser cette représentation est qu'elle est plus précise et premet de visualiser en détail de ce représenter plus facilement les données que la map. C'est une représentation moins attractive que la représentation de la map, mais est plus formelle. 

Quatre données sont représentés, par pays, sur les différents graphes :
 - la température
 - la température moyenne
 - le nombre de catastrophe naturelle
 - le CO~2~ 

La température est représentée à l'aide d'une ligne allant de (-40°C), à (+60°C). Cette ligne de température est aussi représentée par une courbe de tendance qui permet de visualisé mieux le changement des températures.
La présence de catastrophe naturelle est représentée à l'aide d'un nuage de point plein rouge en fonction du pays choisi. 
Le CO~2~ est représenté à l'aide d'une ligne qui permet de visualiser l'evolution du CO~2~ en fonction du temps.

Les couleurs des courbes et des points ont été choisies pour être différenciables par des daltoniens.

## Partie technique

Le projet a été réalisé sous la forme d'un site web interactif. L'ensemble du traitement est fait en Javascript, coté client, afin que le site de nécessite pas de serveur pour fonctionner, il suffit de lancer le fichier ```index.html``` à la racine du projet.

Le Framework Bootstrap 4 a été utilisé pour le design général du site et la librairie D3.js a été utilisée pour générer la carte du monde ainsi que les différents graphiques.

