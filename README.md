# TP Cloud - Daniel Fanion et Audrey Heurtaux

Repository du TP de fin de module Cloud.

Nous avons réussi à terminer le TP, vous pouvez trouver une petite démo [ici](https://youtu.be/qGIEBVjF9X4) !

Vous trouverez dans les dossiers les sources des 3 cloud functions. Toutes les fonctions ont été créées depuis la console GCP, seule différence : analyse et enregistrement ont pour déclencheurs les buckets alors que consultation fonctionne avec un déclencheur HTTP.

Pour la création des buckets fanion_depot et fanion_public, nous avons utilisé directement l'IHM GCP :
![Image Buckets](/ressources/capture1.png "Liste des buckets").
![config Buckets](/ressources/capture3.png "config buckets").
![config Buckets](/ressources/capture4.png "config buckets").


Pour lier les fonctions avec les buckets, nous avons mis ce déclencheur à la création de la fonction : 
![Liaison au bucket](/ressources/capture5.png "laison buckets").

Même chose pour la base SQL : 
![Image BDD](/ressources/capture2.png "Liste des bases").

Pour m'y connecter et la configurer, j'ai utilisé ces commandes : 
```bash
gcloud sql connect photos --user=root
```

Puis j'ai crée la table comme ceci :
```sql
CREATE  DATABASE photos;
USE photos;
CREATE TABLE photos(
    id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(256),
    tags TEXT
    );
```
