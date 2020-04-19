import { Module, ModuleRef, Provider, Inject } from '../src'
import 'reflect-metadata'
import { ProviderNotFoundError } from '../src/errors/module.errors'

describe('testing module', () => {
  it('can access providers inside itself', async () => {
    @Provider()
    class FooProvider {}
    @Module({
      providers: [
        FooProvider
      ]
    })
    class FooModule {
      @Inject() fooProvider!: FooProvider
      onModuleInit () {
        expect(this.fooProvider).toBeInstanceOf(FooProvider)
      }
    }

    await ModuleRef.create(FooModule)
  })

  it('can access one provider inside another provider', async () => {
    @Provider()
    class BarProvider {}
    @Provider()
    class FooProvider {
      constructor (barProvider: BarProvider) {
        expect(barProvider).toBeInstanceOf(BarProvider)
      }
    }
    @Module(
      {
        providers: [
          FooProvider,
          BarProvider
        ]
      }
    )
    class FooModule {}

    await ModuleRef.create(FooModule)
  })

  it('cannot access a private provider from another module', async () => {
    @Provider()
    class PrivateProvider {}

    @Module({})
    class PrivateProviderModule {}

    @Module({ imports: [PrivateProviderModule] })
    class TestModule {
      @Inject() privateProvider!: PrivateProvider
    }

    expect(ModuleRef.create(TestModule)).rejects.toBeInstanceOf(ProviderNotFoundError)
  })
})