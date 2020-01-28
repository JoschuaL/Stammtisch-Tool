# Stammtisch-tool frontend setup

## Build instructions

after cloning the repo , make sure you have a recent version of npm installed, and just execute

```console
npm install -g ionic
```

(Depending on your setup, you might require sudo for this)

and

```console
npm install
```

to download all required dependencies for development. After this use

```console
ionic build
```

to get started, and from there use

```console
ìonic serve
```

to interactively develop in your browser.

If any of these steps prove problematic, there also is a Dockerfile in the repo root.

To use it, build a docker image with

```console
docker build -t $NAME .
```

while in the repo /docker folder, where $NAME is any name you wish to use.

Then start the image with

```console
docker run -p 80:80 -it -v /path/in/docker:/path/outside/docker $NAME
```

whith the /path/in/docker being any path you like, at which the project will be located inside the docker image, and /path/ouside/docker should be the path to your clone of this repo.
After this continue from the "npm install" step inside the image.

For testing flask integration, please refer to the top-level readme of the repo after running the ionic build step above.

For developing in the various app versions use

```console
ìonic cap run $PLATFORM -l -address=0.0.0.0
```

where $PLATFORM corresponds to one of ios/android/electron. Please keep in mind that you have to have a correct android/ios development environment (android studio for android and xcode for ios) setup for the respective platform.

To get a release build for deployment on your server, use

```console
ionic build --prod --release
```

/static folder in the top-level is now your production build.

Depending on you OS, if you used the docker image, connecting to the hosted webside inside the docker container from the outside differs. Please refer to the docker documentation for your respective OS.


