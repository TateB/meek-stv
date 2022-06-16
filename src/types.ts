export type Status = "hopeful" | "elected" | "eliminated";

export type Candidate = {
  name: string;
  status: Status;
  votes: number;
  weight: number;
};

export type State = {
  candidates: Candidate[];
  seats: number;
  excess: number;
  totalVotes: number;
  hbFactor: number;
  quota: number;
  electedCount: number;
  roundNumber: number;
};
