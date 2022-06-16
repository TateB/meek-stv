import { Ballot } from "./ballot";
import { Meek } from "./meek";

export type Config = {
  allowTies?: boolean;
  minSeats?: number;
  maxSeats?: number;
  ballots?: Ballot[];
  candidates: string[];
};

export class Election {
  public ballots: Ballot[];
  public _providedCandidates: string[];
  public allowTies: boolean;
  public minSeats: number;
  public maxSeats: number;

  constructor(config: Config) {
    const configWithDefaults = {
      allowTies: false,
      minSeats: 0,
      maxSeats: Infinity,
      ballots: [],
      ...config,
    };

    this.ballots = configWithDefaults.ballots;
    this._providedCandidates = configWithDefaults.candidates;
    this.allowTies = configWithDefaults.allowTies;
    this.minSeats = configWithDefaults.minSeats;
    this.maxSeats = configWithDefaults.maxSeats;
  }

  private validBallot = (ballot: Ballot) => {
    if (
      ballot.candidates.some(
        (candidate) => !this._providedCandidates.includes(candidate)
      )
    ) {
      return false;
    }

    if (this.maxSeats !== Infinity && ballot.votes.length > this.maxSeats) {
      return false;
    }

    if (this.minSeats !== 0 && ballot.votes.length < this.minSeats) {
      return false;
    }

    return true;
  };

  public addBallot = (ballot: Ballot) => {
    if (!(ballot instanceof Ballot)) {
      ballot = new Ballot(ballot);
    }

    if (!this.validBallot(ballot)) {
      throw new Error("Invalid ballot.");
    } else {
      this.ballots.push(ballot);
      return true;
    }
  };

  public run = (seats: number = 1) => {
    if (seats < 1) {
      throw new Error("Invalid number of seats.");
    }

    return new Meek(this._providedCandidates, seats, this.ballots).count();
  };
}
