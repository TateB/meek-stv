export class Ballot {
  public votes: string[];
  public ranks: any;
  public candidates: string[];
  public count: number;

  constructor(votes: string[], count?: number) {
    const valid = votes.every((vote) => typeof vote === "string");
    if (!valid) {
      throw new Error("Invalid votes.");
    }

    this.votes = votes;
    this.ranks = Object.fromEntries(
      votes.map((candidate, index) => [candidate, index])
    );
    this.candidates = votes.reduce(
      (prev, curr) => (prev.includes(curr) ? prev : [...prev, curr]),
      [] as string[]
    );
    this.count = count || 1;
  }

  public eliminate = (candidate: string | string[]) => {
    let valid = false;
    let eliminatableCandidates: string[] = [];
    if (typeof candidate === "string") {
      valid = true;
      eliminatableCandidates.push(candidate);
    } else if (
      Array.isArray(candidate) &&
      candidate.every((c) => typeof c === "string")
    ) {
      valid = true;
      eliminatableCandidates = candidate;
    }
    if (!valid) return this;

    const newVotes = this.votes.filter(
      (vote) => !eliminatableCandidates.includes(vote)
    );

    return new Ballot(newVotes, this.count);
  };
}
