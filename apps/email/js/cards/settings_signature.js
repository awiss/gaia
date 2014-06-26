/*global define*/
define(function(require) {

var templateNode = require('tmpl!./settings_signature.html'),
    common = require('mail_common'),
    evt = require('evt'),
    Cards = common.Cards;

function SettingsSignatureCard(domNode, mode, args) {
  this.domNode = domNode;
  this.account = args.account;
  this.identity = this.account.identities[0];
  this.signatureNode = domNode
    .getElementsByClassName('tng-signature-input')[0];

  domNode.getElementsByClassName('tng-back-btn')[0]
    .addEventListener('click', this.onBack.bind(this), false);

  domNode.getElementsByClassName('tng-signature-done')[0]
    .addEventListener('click', this.onClickDone.bind(this), false);

  this.signatureNode.value = this.identity.signature;

}

SettingsSignatureCard.prototype = {

  onBack: function() {
    Cards.removeCardAndSuccessors(this.domNode, 'animate', 1);
  },

  onClickDone: function() {
    var signature = this.signatureNode.value;

    // Only push the signature if it was changed
    if (signature !== this.identity.signature) {
      var data = { signature: signature };

      // This is a stopgap to ensure that the UI remains properly updated
      // even if the backend is not fast enough. This is necessary on the
      // setup_account_prefs card, where modifyIdentity does not exist on the
      // identity object yet.
      this.identity.signature = signature;


      if (this.identity.modifyIdentity) {
        this.identity.modifyIdentity(data);
      } else {
        // Todo, implement alternative for identities
        evt.emitWhenListener('identityModified', this.account.id,
          this.identity.id, data);
      }
    }

    this.onBack();

  },

  die: function() {
  }
};

Cards.defineCardWithDefaultMode(
    'settings_signature',
    { tray: false },
    SettingsSignatureCard,
    templateNode
);

return SettingsSignatureCard;
});
