import {
	z,
	ZodTypeAny,
	AnyZodObject,
	ZodObject,
	ZodArray,
	extendShape,
} from 'zod'
import { Context } from './context'

type InferZod<T> = T extends ZodTypeAny ? z.infer<T> : T

type Resolver<
	TContext extends Context = Context,
	TInput = void,
	TOutput = void
> = (opts: {
	ctx: TContext
	input: InferZod<TInput>
}) => InferZod<TOutput> | Promise<InferZod<TOutput>>

type BaseProcedure<
	TContext extends Context = Context,
	TInput = void,
	TOutput = void,
	TMeta = {}
> = {
	input?: TInput
	output?: TOutput
	meta?: TMeta
	resolve: Resolver<TContext, TInput, TOutput>
}

type Procedure<
	TContext extends Context = Context,
	TInput = void,
	TOutput = void,
	TMeta = {}
> = TInput extends void
	? TOutput extends void
		? Omit<BaseProcedure<TContext, TInput, TOutput, TMeta>, 'input' | 'output'>
		: Omit<
				BaseProcedure<TContext, TInput, TOutput, TMeta>,
				'input' | 'output'
		  > & {
				output: TOutput
		  }
	: TOutput extends void
	? Omit<BaseProcedure<TContext, TInput, void, TMeta>, 'input' | 'output'> & {
			input: TInput
	  }
	: Omit<BaseProcedure<TContext, TInput, TOutput, TMeta>, 'input | output'> & {
			input: TInput
			output: TOutput
	  }

type InputWrapper<
	TWrapper extends AnyZodObject,
	TInput extends AnyZodObject | void
> = TInput extends AnyZodObject
	? ZodObject<
			extendShape<TWrapper['shape'], ReturnType<TInput['_def']['shape']>>,
			TInput['_def']['unknownKeys'],
			TInput['_def']['catchall']
	  >
	: TWrapper

/** Wraps the input argument in the resolve function with the wrapper*/
type BaseWrappedProcedure<
	TContext extends Context,
	TInputWrapper extends AnyZodObject,
	TInput extends AnyZodObject | void = void,
	TOutput = void,
	TMeta = {}
> = Omit<BaseProcedure<TContext, TInput, TOutput, TMeta>, 'resolve'> & {
	resolve: Resolver<TContext, InputWrapper<TInputWrapper, TInput>, TOutput>
}

/** Wraps the */
type WrappedProcedure<
	TContext extends Context,
	TInputWrapper extends AnyZodObject,
	TInput extends AnyZodObject | void = void,
	TOutput = void,
	TMeta = {}
> = Omit<
	BaseProcedure<TContext, TInput, TOutput, TMeta>,
	(TOutput extends void ? 'output' : '') | 'input' | 'resolve'
> & {
	input: InputWrapper<TInputWrapper, TInput>
	resolve: Resolver<TContext, InputWrapper<TInputWrapper, TInput>, TOutput>
}

/** Infers procedure types */
export const createProcedure = <
	TContext extends Context = Context,
	TInput extends AnyZodObject | void = void,
	TOutput extends AnyZodObject | ZodArray<AnyZodObject> | void = void,
	TMeta extends {} | void = {}
>(
	procedure: Procedure<TContext, TInput, TOutput, TMeta>
): Procedure<TContext, TInput, TOutput, TMeta> => procedure

/** Returns a wrapper function that wraps the procedure's input in the given wrapper schema. */
export const createProcedureWrapper =
	<TContext extends Context, TMeta = {}>() =>
	<TInputWrapper extends AnyZodObject>(wrapperSchema: TInputWrapper) =>
	<
		TInput extends AnyZodObject | void = void,
		TOutput extends AnyZodObject | ZodArray<AnyZodObject> | void = void
	>(
		procedure: BaseWrappedProcedure<
			TContext,
			TInputWrapper,
			TInput,
			TOutput,
			TMeta
		>
	): WrappedProcedure<TContext, TInputWrapper, TInput, TOutput, TMeta> =>
		({
			...procedure,
			input: (procedure.input
				? wrapperSchema.merge(procedure.input)
				: wrapperSchema) as InputWrapper<TInputWrapper, TInput>,
		} as unknown as WrappedProcedure<
			TContext,
			TInputWrapper,
			TInput,
			TOutput,
			TMeta
		>)