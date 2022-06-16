import { Ballot, Election } from "../src";

const election = new Election({
  candidates: ["One", "Two", "Three", "Four"],
});

election.addBallot(new Ballot(["Three", "Four", "One", "Two"], 170));
election.addBallot(new Ballot(["Four", "One", "Two", "Three"], 26));
election.addBallot(new Ballot(["One", "Two", "Four", "Three"], 15));
election.addBallot(new Ballot(["Two", "One", "Four", "Three"], 17));

const meekWinner = election.run();

console.log(meekWinner.log[0].candidates);
