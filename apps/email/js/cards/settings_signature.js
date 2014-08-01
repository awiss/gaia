/*global define*/
define(function(require) {

'use strict';

var templateNode = require('tmpl!./settings_signature.html'),
    editorMixin = require('./editor_mixins'),
    mix = require('mix'),
    common = require('mail_common'),
    Cards = common.Cards;

function SettingsSignatureCard(domNode, mode, args) {
  this.domNode = domNode;
  this.account = args.account;
  this.identity = this.account.identities[0];
  this.signatureNode = domNode
    .getElementsByClassName('tng-signature-input')[0];

  this._bindPrefs(this.signatureNode);

  domNode.getElementsByClassName('tng-back-btn')[0]
    .addEventListener('click', this.onBack.bind(this), false);

  domNode.getElementsByClassName('tng-signature-done')[0]
    .addEventListener('click', this.onClickDone.bind(this), false);

  this.populateEditor(this.identity.signature || "");

}

SettingsSignatureCard.prototype = {

  onBack: function() {
    Cards.removeCardAndSuccessors(this.domNode, 'animate', 1);
  },

  onClickDone: function() {
    var signature = this.fromEditor();

    // Only push the signature if it was changed
    if (signature !== this.identity.signature) {
      this.identity.modifyIdentity({ signature: signature });
    }

    this.onBack();
  },

  die: function() {
  },

};

mix(SettingsSignatureCard.prototype, editorMixin);

Cards.defineCardWithDefaultMode(
    'settings_signature',
    { tray: false },
    SettingsSignatureCard,
    templateNode
);

return SettingsSignatureCard;
});
