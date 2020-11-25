# Fonction à implémenter

 [x] Avoir la température entre deux dates en fonction d'un pays

 ```js
[{
   date: "1999-01-01",
   temp: 14.4,
},...]
```

 [x] Avoir le nombre de catastrophe du pays entre deux dates

  ```js
[{
   date: "1999-01-01",
   disa: 15,
},...]
```

 [x] Avoir le CO2 entre deux dates

   ```js
[{
   date: "1999-01-01",
   co2: 135.54,
},...]
```

(Je fais un truc global ?)
 [x] Avoir la température entre deux dates (moyenne mondiale)
 [x] Avoir le nombre de catastrophe monde entre deux dates
 
 [ ] Avoir les data qui correspondent à une date (si elle existe ou prendre la plus proche dans le passé si elle existe pas) peut importe le dataset 


 # Utilisation des fonctions

 * Importer le fichier ```datasets/data.js```
 * Importer les dépendances nécessaires<br>Chaque fonction nécessite des variables accessibles dans d'autres fichiers. Les fichiers nécessaires pour chaque fonction sont indiqués dans sa description.<br>(Les dépendances doivent être importées avant le fichier ```data.js```)

 Exemple pour l'utilisation de la fonction ```getTemperaturesByCountry()``` :

 ```js
<script src="./temperatures.js"></script>
<script src="./data.js"></script>
<script>
   let temp = getTemperaturesByCountry("CHE", "1900-01-01", "2000-01-01");
</script>
 ```
