use serde::{Deserialize, Serialize};

use crate::action::{Action, ActionContext};
use crate::timer::{BehaviorAtZero, RunCondition, Timer};
use crate::types::{Phase, SetPlay, Side, State};

/// This struct defines an action for when a team takes a timeout.
#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Timeout {
    /// The side which takes the timeout.
    pub side: Side,
}

impl Action for Timeout {
    fn execute(&self, c: &mut ActionContext) {
        // Cancel all penalty timers.
        c.game.teams.values_mut().for_each(|team| {
            team.players.iter_mut().for_each(|player| {
                player.penalty_timer = Timer::Stopped;
            })
        });

        if c.game.phase != Phase::PenaltyShootout {
            // The next kick-off is for the other team.
            c.game.kicking_side = -self.side;
        }
        c.game.secondary_timer = Timer::Started {
            // In some cases, an existing timer is modified to avoid situations like "We are going
            // to take a timeout once their timeout is over".
            remaining: if c.game.state == State::Timeout
                || (c.game.state == State::Initial && c.game.phase == Phase::SecondHalf)
            {
                c.game.secondary_timer.get_remaining() + c.params.competition.timeout_duration
            } else {
                c.params.competition.timeout_duration.try_into().unwrap()
            },
            run_condition: RunCondition::Always,
            behavior_at_zero: BehaviorAtZero::Overflow,
        };
        c.game.state = State::Timeout;
        c.game.set_play = SetPlay::NoSetPlay;
        c.game.teams[self.side].timeout_budget -= 1;
    }

    fn is_legal(&self, c: &ActionContext) -> bool {
        c.game.state != State::Playing
            && c.game.state != State::Finished
            && (c.game.phase != Phase::PenaltyShootout
                || c.game.state == State::Initial
                || c.game.state == State::Timeout)
            // This check is so you can't take timeouts during a penalty kick Ready/Set. The rules
            // don't explicitly rule this out (I think), but it would be ridiculous if it was
            // legal.
            && (c.game.set_play == SetPlay::NoSetPlay || c.game.set_play == SetPlay::KickOff)
            && c.game.teams[self.side].timeout_budget > 0
    }
}
