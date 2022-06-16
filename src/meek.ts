import { Ballot } from "./ballot";
import { Candidate, State } from "./types";

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

export class Meek {
  public candidates: Candidate[];
  public excess: number;
  public seats: number;
  public totalVotes: number;
  public hbFactor: number;
  public quota: number;
  public electedCount: number;
  public ballots: Ballot[];
  public log: State[] = [];
  private roundNumber = 0;

  constructor(candidates: string[], seats: number, ballots: Ballot[]) {
    this.candidates = candidates.map((candidate) => ({
      name: candidate,
      status: "hopeful",
      votes: 0,
      weight: 1,
    }));
    this.excess = 0;
    this.seats = seats;
    this.totalVotes = ballots.reduce((prev, curr) => prev + curr.count, 0);
    this.hbFactor = 1 / (this.seats + 1);
    this.quota = this.totalVotes * this.hbFactor;
    this.electedCount = 0;
    this.ballots = ballots;
  }

  private getCandidate = (id: string) =>
    this.candidates.find((candidate) => candidate.name === id);

  private setQuota = () => {
    this.quota = (this.totalVotes - this.excess) * this.hbFactor;
  };

  private countRound = () => {
    this.excess = 0;
    this.candidates.forEach((candidate) => (candidate.votes = 0));

    this.ballots.forEach((ballot) => {
      let value = ballot.count;
      ballot.votes.forEach((candidate) => {
        const candObj = this.getCandidate(candidate)!;
        candObj.votes += value * candObj.weight;
        value *= 1 - candObj.weight;
      });
      this.excess += value;
    });

    this.setQuota();
  };

  private isConverged = () => {
    var converged = true;
    this.candidates
      .filter((candidate) => candidate.status === "elected")
      .forEach((candidate) => {
        const ratio = this.quota / candidate.votes;
        if (ratio > 1.00001 || ratio < 0.9999) {
          return false;
        }
      });
    return true;
  };

  private updateWeights = () => {
    this.candidates.forEach((candidate) => {
      if (candidate.status === "elected") {
        candidate.weight *= this.quota / candidate.votes;
      }
    });
  };

  private eliminate = (ids: string[]) =>
    ids.forEach((id) => {
      const candidate = this.getCandidate(id)!;
      candidate.status = "eliminated";
      candidate.weight = 0;
    });

  private declareElected = () => {
    let someoneElected = false;
    let electAll = false;

    const elected = this.candidates.filter(
      (candidate) => candidate.status === "elected"
    );
    const hopefuls = this.candidates.filter(
      (candidate) => candidate.status === "hopeful"
    );

    if (this.seats === elected.length + hopefuls.length) {
      electAll = true;
    }

    const potentials = this.candidates.filter(
      (candidate) =>
        candidate.status === "hopeful" && candidate.votes > this.quota
    );

    const excessSeats = Math.max(
      potentials.length + this.electedCount - this.seats,
      0
    );

    if (excessSeats) {
      this.eliminate(
        shuffleArray(potentials)
          .filter((_, i) => i < excessSeats)
          .map((candidate) => candidate.name)
      );
    }

    this.candidates
      .filter(
        (candidate) =>
          candidate.status === "hopeful" &&
          (candidate.votes > this.quota || electAll)
      )
      .forEach((candidate) => {
        someoneElected = true;
        candidate.status = "elected";
        this.electedCount += 1;
      });

    return someoneElected;
  };

  private findLowest = () => {
    const active = this.candidates.filter(
      (candidate) => candidate.status === "hopeful"
    );

    if (active.length === 0) {
      throw new Error("No hopefuls remain. Are there enough candidates?");
    }

    const votes = active.map((candidate) => candidate.votes);

    const lowestVote = Math.min(...votes);

    return active.filter((candidate) => candidate.votes === lowestVote);
  };

  private eliminateLowest = () => {
    const lowestCandidateArr = this.findLowest();
    const lowestCandidate =
      lowestCandidateArr[Math.floor(Math.random() * lowestCandidateArr.length)]
        .name;
    return this.eliminate([lowestCandidate]);
  };

  private createLog = (): State => ({
    candidates: this.candidates,
    seats: this.seats,
    excess: this.excess,
    totalVotes: this.totalVotes,
    hbFactor: this.hbFactor,
    quota: this.quota,
    electedCount: this.electedCount,
    roundNumber: this.roundNumber,
  });

  public count = () => {
    while (this.electedCount < this.seats) {
      this.countRound();
      this.updateWeights();
      if (!this.isConverged()) continue;
      this.declareElected() || this.eliminateLowest();
      this.log.push(this.createLog());
      this.roundNumber += 1;
    }

    return {
      electedCandidates: this.candidates
        .filter((candidate) => candidate.status === "elected")
        .map((candidate) => candidate.name),
      log: this.log,
    };
  };
}
