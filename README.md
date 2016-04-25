# Make Apps

## Make it work

In the main folder, install the dependencies:

npm is used for the gulp tasks and the service/data layer
bower is used for the web UI components (Polymer, Pure ...)

```shell
npm install
bower install
```

If it is the first time you use the project, run

```shell
gulp build
```

It will prepare everything.

Once done, you can start the development gulp task

```shell
gulp dev
```

This will watch the files and rebuild when necessary. It also start a web server listening on port 4000

## Take a snapshot of the app to be distributed with `kano-content`
Check out the branch you want to take a snapshot of and follow these instructions:

1. Run: `npm run content-snap`

2. If everything goes well a file called `assets.tar.gz` will be created in the root dir of the repository.
3. Use the online interface to upload it to `kano-content`

## Testing workflow on Kano OS

Because of some native extensions of some dependencies, `npm install`
fails on the Pi. There are currently 2 documented methods of syncing the
changes from your local dev machine to a Pi for testing, without having to
wait for the build server to generate a debian package.

### Get local changes to the Pi (Follow either method):
#### Use provided script
We have created a bash script that reduces the no of steps to allow for
shorter iterations. To use it, do the following:
1. From the root of this repository run: `push_to_pi.sh`
(You may need to set the executable bit on this script)
2. The location of your files are printed on your terminal.

If you need to iterate change the files on your local machine and re run the
script. It will only copy over the diff of the files so subsequent times will
be faster than the first time.

Feel free to improve this script :-)


#### Do it manually
The easiest way to test on the Pi is to build on
your dev machine and rsync the directory to over. Like this:

```bash
    cd make-apps/
    npm install
    bower install
    npm build
    rsync -av -e 'ssh -o StrictHostKeyChecking=no' --exclude=.git --exclude=node_modules . "kano@10.0.0.231:/tmp/radek-make-apps"
```

### Access the app on the kit (assumes you rsynced or used the script -see above)
The next steps are:

* Get on your Pi (direct or via VNC)
* Open the terminal
* `cd /tmp/radek-make-apps/rpi/bin` (hint: use your own name here to avoid clashes with others)
* `./make-apps`
* The app should start loading

To debug, you'll need to rebuild the app, rsync again and relaunch it on the Pi.

### Notes on using HQ test station

If you'd like to quickly try things out, there's a test station in the office:

* IP: 10.0.0.231
* ssh user: kano
* ssh pass: kano
* vnc pass: online

You can ssh/vnc into it and try things out. There's a cron job that keeps our nightly
builds of Make Apps up-to-date on it if you just want to check that `master` works.
For testing features you're working on, see the workflow above.


# Testing & Deployment

### Staging
Master is automatically deployed to Heroku. May be found here: http://kano-make-apps-again.herokuapp.com/

### Production
Production is served from S3. May be found here: http://apps-site.kano.me
In order to deploy please use jenkins.kano.me and select `make-apps` from the deploy project.