# meek-stv

**a lightweight meek stv javascript library**

based on [caritat](https://github.com/anarchodin/caritat)

## Usage

import Election and Ballot from the package

```ts
import { Election, Ballot } from "meek-stv";
```

create a new election with the available options and your candidates

```ts
const candidates = ["Epic", "Cool", "Nice", "Great"];

const election = new Election({ candidates });
```

add the ballots to the election

```ts
election.addBallot(new Ballot(["Cool", "Epic", "Great", "Nice"], 29));

election.addBallot(new Ballot(["Epic", "Cool", "Great", "Nice"], 13));

election.addBallot(new Ballot(["Great", "Epic", "Cool", "Nice"], 38));

election.addBallot(new Ballot(["Nice", "Epic", "Cool", "Great"], 15));
```

run the election with the amount of seats you want elected and get the results

```ts
const results = election.run(1);
```
