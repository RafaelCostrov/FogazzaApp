from sqlalchemy import func, and_, distinct
from sqlalchemy.orm import joinedload
from model.atendimento import Atendimento, AtendimentoFogazza


class AtendimentoRepository:

    def __init__(self, session):
        self.session = session

    def adicionar_atendimento(self, atendimento: Atendimento):
        try:
            self.session.add(atendimento)
            self.session.commit()
            self.session.refresh(atendimento)
            return atendimento
        except Exception as e:
            self.session.rollback()
            raise e

    def listar_atendimentos(self):
        try:
            return self.session.query(Atendimento).options(joinedload(Atendimento.itens)).filter(Atendimento.ativo == True).all()
        except Exception as e:
            raise e

    def filtrar_atendimentos(self, id_atendimento=None, id_fogazzas=None, tipo_cliente=None, preco_min=None, preco_max=None, data_hora_inicio=None,
                             data_hora_fim=None, offset=None, limit=None, order_by=None, order_dir=None):
        try:
            query = self.session.query(Atendimento)
            total = query.count()
            filtros = [Atendimento.ativo == True]

            if id_atendimento is not None:
                filtros.append(Atendimento.id_atendimento.in_(id_atendimento))
            if id_fogazzas is not None:
                # include any atendimento that contains at least one of the selected fogazzas
                # original implementation required all flavors; change to OR semantics
                query = query.join(AtendimentoFogazza)
                query = query.filter(
                    AtendimentoFogazza.id_fogazza.in_(id_fogazzas))
                # avoid duplicate atendimentos due to join
                query = query.distinct()
            if tipo_cliente is not None:
                filtros.append(Atendimento.tipo_cliente.in_(tipo_cliente))
            if preco_min is not None:
                filtros.append(Atendimento.preco_total >= preco_min)
            if preco_max is not None:
                filtros.append(Atendimento.preco_total <= preco_max)
            if data_hora_inicio is not None:
                filtros.append(Atendimento.comprado_em >= data_hora_inicio)
            if data_hora_fim is not None:
                filtros.append(Atendimento.comprado_em <= data_hora_fim)

            query = query.filter(and_(*filtros))

            campos_validos = {
                "id_atendimento": Atendimento.id_atendimento,
                "tipo_cliente": Atendimento.tipo_cliente,
                "preco_total": Atendimento.preco_total,
                "comprado_em": Atendimento.comprado_em
            }

            if order_by is not None and order_by in campos_validos:
                coluna = campos_validos[order_by]
                if order_dir == "desc":
                    coluna = coluna.desc()
                else:
                    coluna = coluna.asc()
                query = query.order_by(coluna)

            total_filtrado = query.count()
            valor_total = query.with_entities(
                func.sum(Atendimento.preco_total)).scalar()

            if offset is not None:
                query = query.offset(offset)
            if limit is not None:
                query = query.limit(limit)

            resultados = query.all()
            return resultados, total, total_filtrado, valor_total

        except Exception as e:
            raise e

    def filtrar_atendimento_por_id(self, id_atendimento):
        try:
            return self.session.query(Atendimento).options(joinedload(Atendimento.itens)).filter(Atendimento.id_atendimento == id_atendimento).first()
        except Exception as e:
            raise e

    def remover_atendimento(self, id_atendimento):
        try:
            atendimento = self.filtrar_atendimento_por_id(id_atendimento)
            if atendimento:
                atendimento.ativo = False
                self.session.commit()
            else:
                raise Exception("Atendimento não encontrado")
        except Exception as e:
            self.session.rollback()
            raise e

    def atualizar_atendimento(self, id_atendimento, tipo_cliente=None, preco_total=None, itens=None):
        try:
            atendimento = self.filtrar_atendimento_por_id(id_atendimento)
            if atendimento:
                if tipo_cliente is not None:
                    atendimento.tipo_cliente = tipo_cliente
                if preco_total is not None:
                    atendimento.preco_total = preco_total
                if itens is not None:
                    atendimento.itens = itens
                self.session.commit()
            else:
                raise Exception("Atendimento não encontrado")
        except Exception as e:
            self.session.rollback()
            raise e
