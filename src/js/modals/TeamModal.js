import BaseModal from "./BaseModal";
//import teamHbs from '../templates/team.hbs';
import teamModalHbs from '../../templates/team.hbs'
/**
 * @class Represents Team Window. Extends from BaseModal.
 */
export default class TeamModal extends BaseModal {
  /**
   * @constructor
   * @param {array} teamMembers - array of objects with team members data
   */
  constructor(teamMembers) {
    super(teamModalHbs(teamMembers), { containerClass: 'team-container' });
  }
}
