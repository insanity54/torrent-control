class ruTorrentApi extends BaseClient {

    constructor(serverSettings) {
        super();

        this.settings = serverSettings;
    }

    logIn() {
        const {username, password} = this.settings;

        if (username && password)
            this.addAuthRequiredListener();

        return Promise.resolve();
    }

    logOut() {
        this.removeEventListeners();

        return Promise.resolve();
    }

    addTorrent(torrent, options = {}) {
        const {hostname} = this.settings;

        return new Promise((resolve, reject) => {
            let form = new FormData();
            form.append('torrent_file', torrent, 'temp.torrent');

            if (options.paused)
                form.append('torrents_start_stopped', options.paused);

            if (options.path)
                form.append('dir_edit', options.path);

            if (options.label)
                form.append('label', options.label);

            fetch(hostname + 'php/addtorrent.php?json=1', {
                method: 'POST',
                credentials: 'include',
                body: form
            })
            .then(this.parseJsonResponse)
            .then((json) => {
                if (json.result && json.result === 'Success')
                    resolve();
                else
                    throw new Error(browser.i18n.getMessage('torrentAddError', json.result || ''));
            })
            .catch((error) => reject(error));
        });
    }

    addTorrentUrl(url, options = {}) {
        const {hostname} = this.settings;

        let params = new URLSearchParams();
        params.append('json', 1);
        params.append('url', url);

        if (options.paused)
            params.append('torrents_start_stopped', options.paused);

        if (options.path)
            params.append('dir_edit', options.path);

        if (options.label)
            params.append('label', options.label);

        return new Promise((resolve, reject) => {
            fetch(hostname + 'php/addtorrent.php?' + params.toString(), {
                method: 'GET',
                credentials: 'include'
            })
            .then(this.parseJsonResponse)
            .then((json) => {
                if (json.result && json.result === 'Success')
                    resolve();
                else
                    throw new Error(browser.i18n.getMessage('torrentAddError', json.result || ''));
            })
            .catch((error) => reject(error));
        });
    }

}
