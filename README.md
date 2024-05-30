## How To Build


1. install node first

    ```
    version: v18.20.2

    download: https://nodejs.org/en/download/package-manager

    Choose the version which is compatible with your OS.
    ```

2. install dependencies

    ```bash
    npm install .
    ```

3. run test

    ```bash
    npm run sepolia
    ```

4. run build prod

    ```bash
    npm run build
    # The static files will be in dist folder.

    tar -zcvf dist.tar.gz dist
    ```

5. move dist to your server

    ```bash
    scp -r dist admin@52.194.243.217:/home/admin/nova
    ```
