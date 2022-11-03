import { type RelationTuple } from '../relation-tuple'
import { parseRelationTupleWithReplacements } from './relation-tuple-with-replacements-parser'
import { applyReplacements } from './relation-tuple-with-replacements'

describe('parseRelationTupleWithReplacements tests', () => {
	it('simple replacements with subject', () => {
		const relationTupleWithReplacements = parseRelationTupleWithReplacements(
			({ namespace, object, relation, subject }) => `${namespace}:${object}#${relation}@${subject}`,
		).unwrapOrThrow()

		const relationTuple = applyReplacements(relationTupleWithReplacements, {
			namespace: 'aaa',
			object: 'bbb',
			relation: 'ccc',
			subject: 'ddd',
		})

		expect(relationTuple).toEqual({
			namespace: 'aaa',
			object: 'bbb',
			relation: 'ccc',
			subjectIdOrSet: 'ddd',
		} as RelationTuple)
	})

	it('simple replacements with (subjectSet)', () => {
		const relationTupleWithReplacements = parseRelationTupleWithReplacements(
			({ namespace, object, relation, subjectNamespace, subjectObject, subjectRelation }) =>
				`${namespace}:${object}#${relation}@(${subjectNamespace}:${subjectObject}#${subjectRelation})`,
		).unwrapOrThrow()

		const relationTuple = applyReplacements(relationTupleWithReplacements, {
			namespace: 'aaa',
			object: 'bbb',
			relation: 'ccc',
			subjectNamespace: 'ddd',
			subjectObject: 'eee',
			subjectRelation: 'fff',
		})

		expect(relationTuple).toEqual({
			namespace: 'aaa',
			object: 'bbb',
			relation: 'ccc',
			subjectIdOrSet: {
				namespace: 'ddd',
				object: 'eee',
				relation: 'fff',
			},
		} as RelationTuple)
	})

	it('multiple replacements per part with subject', () => {
		const relationTupleWithReplacements = parseRelationTupleWithReplacements(
			({ namespace, a, object, b, relation, c, subject, d }) =>
				`*${namespace}-${a}-${namespace}*:*${object}-${b}*#*${relation}-${c}*@*${subject}-${d}*`,
		).unwrapOrThrow()

		const relationTuple = applyReplacements(relationTupleWithReplacements, {
			namespace: 'aaa',
			object: 'bbb',
			relation: 'ccc',
			subject: 'ddd',
			a: '1',
			b: '2',
			c: '3',
			d: '4',
		})

		expect(relationTuple).toEqual({
			namespace: '*aaa-1-aaa*',
			object: '*bbb-2*',
			relation: '*ccc-3*',
			subjectIdOrSet: '*ddd-4*',
		} as RelationTuple)
	})
})