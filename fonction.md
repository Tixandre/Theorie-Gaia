# Fonction à implémenter

 [*] Avoir la température entre deux dates en fonction d'un pays 
 ```json
[{
   "Date": 1999-01-01,
   "Temp": "15",
},...]
```
 [] Avoir le nombre de catastrophe du pays entre deux dates
  ```json
[{
   "Date": 1999-01-01,
   "Cata": "15",
},...]
```
 [] Avoir le CO2 entre deux dates
   ```json
[{
   "Date": 1999-01-01,
   "CO²": "15",
},...]
```

(Je fais un truc global ?)
 [] Avoir la température entre deux dates (moyenne mondiale)
 [] Avoir le nombre de catastrophe monde entre deux dates


 # Utilisation des fonctions

 * Importer le fichier ```datasets/data.js```
 * Importer les dépendances nécessaires<br>Chaque fonction nécessite des variables accessibles dans d'autres fichiers. Les fichiers nécessaires pour chaque fonction sont indiqués dans sa description.<br>(Les dépendances doivent être importées avant le fichier ```data.js```)

 Exemple pour l'utilisation de la fonction ```getTemperaturesByCountry()``` :

 ```js
<script src="./temperatures.js"></script>
<script src="./data.js"></script>
<script>
   let temp = getTemperatures("CHE", "1900-01-01", "2000-01-01");
</script>
 ```