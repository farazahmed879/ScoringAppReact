using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScoringAppReact.Models
{
    public class Team : FullAuditedEntity<long>, IMayHaveTenant
    {
        public Team()
        {
            Players = new List<Player>();
            OpponentTeamMatches = new List<Match>();
            HomeTeamMatches = new List<Match>();
            TeamScores = new List<TeamScore>();
            FallOfWickets = new List<FallOfWicket>();
            MatchSchedules = new List<MatchSchedule>();
        }

        [Required]
        public string Name { get; set; }
        [StringLength(100)]
        public string Place { get; set; }
        public string Zone { get; set; }
        public string Contact { get; set; }
        public bool IsRegistered { get; set; }
        [Required]
        public string City { get; set; }
        public string FileName { get; set; }
        public List<Player> Players { get; set; }
        public List<Match> OpponentTeamMatches { get; set; }
        public List<Match> HomeTeamMatches { get; set; }
        public List<TeamScore> TeamScores { get; set; }
        public List<FallOfWicket> FallOfWickets { get; set; }
        public List<MatchSchedule> MatchSchedules { get; set; }
        public List<EventTeam> EventTeams { get; set; }
        public int? TenantId { get; set; }
    }
}