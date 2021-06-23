## Subtitle Scraping

+ Requirements

|                                      |
|--------------------------------------|
| Docker                               |      
|--------------------------------------|
| Docker Compose                       |
|--------------------------------------|

+ Run

```sh
$ chmod +x build.sh
$ ./build.sh {legendasTvUsername} {legendasTvPassword}
```

+ Instructions

```
After few seconds, that could vary based on computing resources, you can open your mongodb 
GUI or command line and you'll se a new database called `scraping`. Inside it, there will 
be a collection named `subtitles`.
You can open it to see all subtitles that the script was able to find and you can download 
it using the `directLink` attribute.
```


