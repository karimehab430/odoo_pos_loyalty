# -*- coding: utf-8 -*-
# from odoo import http


# class PosDiscountLoyalty(http.Controller):
#     @http.route('/pos_discount_loyalty/pos_discount_loyalty', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/pos_discount_loyalty/pos_discount_loyalty/objects', auth='public')
#     def list(self, **kw):
#         return http.request.render('pos_discount_loyalty.listing', {
#             'root': '/pos_discount_loyalty/pos_discount_loyalty',
#             'objects': http.request.env['pos_discount_loyalty.pos_discount_loyalty'].search([]),
#         })

#     @http.route('/pos_discount_loyalty/pos_discount_loyalty/objects/<model("pos_discount_loyalty.pos_discount_loyalty"):obj>', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('pos_discount_loyalty.object', {
#             'object': obj
#         })

