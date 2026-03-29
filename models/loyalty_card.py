from odoo import api, fields, models


class LoyaltyCard(models.Model):
    _name = 'pos.loyalty.card'
    _description = 'Loyalty Card'

    code = fields.Char(required=True, index=True)
    points = fields.Float(default=0)
    partner_id = fields.Many2one(comodel_name='res.partner', required=True)
    _sql_constraints = [('code_unique', 'UNIQUE(code)', 'Code must be unique')]

    @api.model
    def add_points(self, card_id, amount):
        card = self.browse(card_id)
        card.points += amount
        return card.points

    @api.model
    def lookup(self,code):
        card = self.search([('code','=',code)])

        if not card:
            return {'error': 'Member not found'}
        discount = 5
        return {'id': card.id,
                'name':card.partner_id.name,
                'points': card.points,
                'discount':discount}