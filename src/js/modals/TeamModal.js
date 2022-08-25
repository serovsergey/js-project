import BaseModal from "./BaseModal";
//import teamHbs from '../templates/team.hbs';
import teamModalHbs from '../../templates/team.hbs'

export default class TeamModal extends BaseModal {
  constructor(teamMembers) {
    super(teamModalHbs(teamMembers), { containerClass: 'team-container' });
  }
}
