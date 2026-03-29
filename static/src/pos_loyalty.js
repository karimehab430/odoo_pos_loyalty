/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { Dialog } from "@web/core/dialog/dialog";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { useService } from "@web/core/utils/hooks";
import { ControlButtons } from "@point_of_sale/app/screens/product_screen/control_buttons/control_buttons";
import { makeAwaitable } from "@point_of_sale/app/store/make_awaitable_dialog";
import { patch } from "@web/core/utils/patch";
import { PaymentScreen } from "@point_of_sale/app/screens/payment_screen/payment_screen";

export class LoyaltyPopup extends Component {
  static template = "pos_discount_loyalty.LoyaltyPopup";
  static components = { Dialog };
  static props = {
    close: Function,
    getPayload: Function,
    order: { type: Object, optional: true },
  };

  setup() {
    this.pos = usePos();
    this.state = useState({ code: "", member: null, error: null });
    this.orm = useService("orm");
  }

  async search() {
    const member = await this.orm.call("pos.loyalty.card", "lookup", [
      this.state.code,
    ]);
    if (member?.error) {
      this.state.member = null;
      this.state.error = member.error;
      return;
    }
    this.state.member = member;
    this.state.error = null;
  }
  async confirm() {
    this.props.getPayload(this.state.member);
    this.props.close();
  }
}

patch(ControlButtons.prototype, {
  async onClickLoyalty() {
    const order = this.pos.get_order();
    const payload = await makeAwaitable(this.dialog, LoyaltyPopup, {
      order: order,
    });
    if (!payload) return;
    order.loyalty_member = payload;
    order
      .get_orderlines()
      .forEach((line) => line.set_discount(payload.discount));
  },
});

patch(PaymentScreen.prototype, {
  setup() {
    super.setup();
    this.orm = useService("orm");
    this.notification = useService("notification");
  },
  async validateOrder(isForceValidate) {
    const validatedOrder = await super.validateOrder(isForceValidate);
    if (validatedOrder) {
      const currentOrder = this.pos.get_order();
      const loyaltyMember = currentOrder.loyalty_member;
      if (loyaltyMember) {
        const newBalance = await this.orm.call(
          "pos.loyalty.card",
          "add_points",
          [loyaltyMember.id, currentOrder.get_total_with_tax()],
        );
        this.notification.add(
          `Loyalty points updated! New balance: ${newBalance} points`,
          { type: "success" },
        );
      }
    }
  },
});
