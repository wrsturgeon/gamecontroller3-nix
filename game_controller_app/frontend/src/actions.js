export const PENALTIES = [
  ["Pushing", "pushing"],
  ["Foul", "foul"],
  ["Fallen / Inactive", "fallenInactive"],
  ["Leaving the Field", "leavingTheField"],
  ["Motion in Set", "motionInSet"],
  ["Illegal Position", "illegalPosition"],
  ["Ball Holding", "ballHolding"],
  ["Penalty Kick", "penaltyKick"],
  ["Local Game Stuck", "localGameStuck"],
  ["Pick-Up", "requestForPickUp"],
  ["Player Stance", "playerStance"],
  ["Arms / Hands", "playingWithArmsHands"],
];

const NUM_OF_PLAYERS = 20;
const NUM_OF_TEAMS = 2;

const TEAM_ACTION_BASE = 0;

export const TIMEOUT = 0;
export const GLOBAL_GAME_STUCK = 1;
export const GOAL = 2;
export const GOAL_KICK = 3;
export const KICK_IN = 4;
export const CORNER_KICK = 5;

const NUM_OF_TEAM_ACTIONS = 6;

const GAME_ACTION_BASE = TEAM_ACTION_BASE + NUM_OF_TEAMS * NUM_OF_TEAM_ACTIONS;

export const SWITCH_HALF = 0;
export const START_PENALTY_SHOOTOUT = 1;
export const WAIT_FOR_PENALTY_SHOT = 2;
export const WAIT_FOR_SET_PLAY = 3;
export const FREE_PENALTY_SHOT = 4;
export const FINISH_SET_PLAY = 5;
export const FREE_SET_PLAY = 6;
export const FINISH_PENALTY_SHOT = 7;
export const FINISH_HALF = 8;
// These are game actions because they are part of the center panel.
export const START_KICK_OFF_HOME = 9;
export const START_KICK_OFF_AWAY = 10;

const NUM_OF_GAME_ACTIONS = 11;

const PENALTY_ACTION_BASE = GAME_ACTION_BASE + NUM_OF_GAME_ACTIONS;

const NUM_OF_PENALTY_ACTIONS = NUM_OF_TEAMS * NUM_OF_PLAYERS * (PENALTIES.length + 1); // The + 1 is the unpenalize action.

export const NUM_OF_ACTIONS =
  NUM_OF_TEAMS * NUM_OF_TEAM_ACTIONS + NUM_OF_GAME_ACTIONS + NUM_OF_PENALTY_ACTIONS;

export const getActions = () => {
  var actions = [];
  for (const side of ["home", "away"]) {
    actions.push(
      { type: "timeout", args: { side: side } },
      { type: "globalGameStuck", args: { side: side } },
      { type: "goal", args: { side: side } },
      { type: "startSetPlay", args: { side: side, setPlay: "goalKick" } },
      { type: "startSetPlay", args: { side: side, setPlay: "kickIn" } },
      { type: "startSetPlay", args: { side: side, setPlay: "cornerKick" } }
    );
  }
  actions.push({ type: "switchHalf", args: null });
  actions.push({ type: "startPenaltyShootout", args: { sides: "homeDefendsLeftGoal" } });
  actions.push({ type: "waitForPenaltyShot", args: null });
  actions.push({ type: "waitForSetPlay", args: null });
  actions.push({ type: "freePenaltyShot", args: null });
  actions.push({ type: "finishSetPlay", args: null });
  actions.push({ type: "freeSetPlay", args: null });
  actions.push({ type: "finishPenaltyShot", args: null });
  actions.push({ type: "finishHalf", args: null });
  actions.push({ type: "startSetPlay", args: { side: "home", setPlay: "kickOff" } });
  actions.push({ type: "startSetPlay", args: { side: "away", setPlay: "kickOff" } });
  for (const penalty of PENALTIES) {
    for (const side of ["home", "away"]) {
      for (let number = 1; number <= NUM_OF_PLAYERS; ++number) {
        actions.push({ type: "penalize", args: { side: side, player: number, call: penalty[1] } });
      }
    }
  }
  for (const side of ["home", "away"]) {
    for (let number = 1; number <= NUM_OF_PLAYERS; ++number) {
      actions.push({ type: "unpenalize", args: { side: side, player: number } });
    }
  }
  return actions;
};

export const extractTeamActions = (legalActions, side) => {
  return side === "home"
    ? legalActions.slice(TEAM_ACTION_BASE, TEAM_ACTION_BASE + NUM_OF_TEAM_ACTIONS)
    : legalActions.slice(
        TEAM_ACTION_BASE + NUM_OF_TEAM_ACTIONS,
        TEAM_ACTION_BASE + NUM_OF_TEAMS * NUM_OF_TEAM_ACTIONS
      );
};

export const extractGameActions = (legalActions) => {
  return legalActions.slice(GAME_ACTION_BASE, GAME_ACTION_BASE + NUM_OF_GAME_ACTIONS);
};

export const extractPenaltyActions = (legalActions) => {
  return legalActions.slice(PENALTY_ACTION_BASE, PENALTY_ACTION_BASE + NUM_OF_PENALTY_ACTIONS);
};

export const isPenaltyCallLegal = (legalPenaltyActions, callIndex) => {
  return legalPenaltyActions
    .slice(
      callIndex * NUM_OF_TEAMS * NUM_OF_PLAYERS,
      (callIndex + 1) * NUM_OF_TEAMS * NUM_OF_PLAYERS
    )
    .some((element) => element != 0);
};

export const isPenaltyCallLegalForPlayer = (legalPenaltyActions, side, player, callIndex) => {
  return (
    legalPenaltyActions[
      (callIndex === null ? PENALTIES.length : callIndex) * NUM_OF_TEAMS * NUM_OF_PLAYERS +
        (side === "home" ? 0 : NUM_OF_PLAYERS) +
        (player - 1)
    ] != 0
  );
};