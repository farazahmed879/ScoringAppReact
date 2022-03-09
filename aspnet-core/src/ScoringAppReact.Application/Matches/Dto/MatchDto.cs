using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using Abp.Authorization.Roles;
using Abp.AutoMapper;
using ScoringAppReact.Authorization.Roles;
using ScoringAppReact.Models;

namespace ScoringAppReact.Matches.Dto
{
    public class MatchDto : EntityDto<long>
    {
        public long? Id { get; set; }
        public string Ground { get; set; }
        public int MatchOvers { get; set; }
        public string MatchDescription { get; set; }
        public int? Season { get; set; }
        public long? EventId { get; set; }
        public string TossWinningTeam { get; set; }
        public long? DateOfMatch { get; set; }
        public string HomeTeam { get; set; }
        public string OppponentTeam { get; set; }
        public float? HomeTeamOvers { get; set; }
        public float? OppTeamOvers { get; set; }
        public string FileName { get; set; }
        public string MatchType { get; set; }
        public string EventStage { get; set; }
        public string PlayerOTM { get; set; }
        public int? TenantId { get; set; }
    }
}