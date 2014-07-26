/*global define*/
define(function(require) {

'use strict';

var templateNode = require('tmpl!./settings_signature.html'),
    common = require('mail_common'),
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

  this.populateEditor(this.identity.signature || "");

}

SettingsSignatureCard.prototype = {

  onBack: function() {
    console.log('leaving identity', this.identity.signature);
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

  /**
   * Inserts text into the contenteditable div
   */
  populateEditor: function(value) {
    var lines = value.split('\n');
    var frag = document.createDocumentFragment();
    for (var i = 0, len = lines.length; i < len; i++) {
      if (i) {
        frag.appendChild(document.createElement('br'));
      }
      frag.appendChild(document.createTextNode(lines[i]));
    }
    this.signatureNode.appendChild(frag);
  },

  /**
   * Gets the raw value from the contenteditable div
   */
  fromEditor: function() {
    var content = '';
    var len = this.signatureNode.childNodes.length;
    for (var i = 0; i < len; i++) {
      var node = this.signatureNode.childNodes[i];
      if (node.nodeName === 'BR' &&
          // Gecko's contenteditable implementation likes to create a synthetic
          // trailing BR with type="_moz".  We do not like/need this synthetic
          // BR, so we filter it out.  Check out
          // nsTextEditRules::CreateTrailingBRIfNeeded to find out where it
          // comes from.
          node.getAttribute('type') !== '_moz') {
        content += '\n';
      } else {
        content += node.textContent;
      }
    }

    return content;
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
