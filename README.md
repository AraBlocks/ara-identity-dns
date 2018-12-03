<img src="https://github.com/arablocks/ara-module-template/blob/master/ara.png" width="30" height="30" /> dns-identity-resolution
========

Get DIDs stored in TXT records for domains

## Table of Contents
* [Status](#status)
* [Installation](#installation)
* [Usage](#usage)
* [API](#api)
* [Contributing](#contributing)

## Status
**Stable**

## Installation

`npm install arablocks/dns-identity-resolution`

## Usage
```js
const { getDID } = require('dns-identity-resolution')

const did = await getDID({ domain: 'ara.one' })
```

## API Docs

<a name="getDID"></a>
### `async getDID({ domain, dns = '8.8.8.8', port = 53 })`
Resolve TXT record matching given domain

- `domain`: Domain of TXT record
- `[dns]`: IP of desired DNS server
- `[port]`: Port to communicate with DNS server on

Returns `Object<DID>`. Returns DID object of info about identity

## Contributing
- [Commit message format](/.github/COMMIT_FORMAT.md)
- [Commit message examples](/.github/COMMIT_FORMAT_EXAMPLES.md)
- [How to contribute](/.github/CONTRIBUTING.md)
- [Release versioning guidelines](https://semver.org/)

## License
LGPL-3.0
