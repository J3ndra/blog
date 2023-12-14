---
title: What is Flutter Cubit BLoC and How To Test It?
author: Junianto Endra kartika
pubDatetime: 2023-12-12T22:42:51Z
postSlug: what-is-flutter-cubit-bloc-and-how-to-test-it
featured: true
ogImage: https://i.ibb.co/18B4C65/flutter-cubit-bloc-unit-testing-og.png
tags:
  - Dart
  - Flutter
  - BLoC
  - Cubit BLoC
  - Unit Testing
description: How to use Cubit BLoC in Flutter and test it using bloc_test with unit testing
canonicalURL: https://juniantodev.vercel.app/posts/what-is-flutter-cubit-bloc-and-how-to-test-it
---

## Table of contents

In today's blog post, I'll delve into the intricacies of utilizing cubit BLoC and walk you through the process of testing it with bloc_test through the lens of Unit Testing.

## Why use cubit?

What led me to choose Cubit over Bloc in this post? Well, Cubit offers a more straightforward and user-friendly approach to state management. In this context, I'm focusing solely on handling the addition and subtraction of integer values from the CounterCubit state. Moreover, opting for Cubit also streamlines the testing process, a topic I'll delve deeper into later in this post.

## What is bloc_test?

bloc_test is a testing toolkit crafted to simplify unit testing for Bloc and Cubit in Flutter. Packed with utilities and functions, it makes testing expressive and efficient.

1. Ease of Use:
   bloc_test simplifies the testing process with its user-friendly syntax, making it easy to grasp and implement.

2. Enhanced Expressiveness:
   Tests written using bloc_test are more expressive and descriptive, making it straightforward to understand the objectives and testing logic.

3. Efficient Testing:
   bloc_test's features support efficient testing, enabling developers to concentrate on the most crucial aspects of testing.

## Code time!

> Don't forget to create new project!

1. Integrate the necessary dependencies

   ```bash
   flutter pub add flutter_bloc
   dart pub add bloc_test
   ```

2. Develop both the screen and its corresponding logic

   ```dart
    // main.dart

    void main() {
        runApp(const MainApp());
    }

    class MainApp extends StatelessWidget {
        const MainApp({super.key});

        @override
        Widget build(BuildContext context) {
            return MaterialApp(
                home: BlocProvider(
                    create: (_) => CounterCubit(),
                    child: const CounterPage(),
                ),
            );
        }
    }
   ```

   ```dart
    // counter_cubit.dart

    class CounterCubit extends Cubit<int> {
        CounterCubit() : super(0);

        void increment() => emit(state + 1);
        void decrement() {
            if (state > 0) {
                emit(state - 1);
            }
        }
    }
   ```

   ```dart
    // pages/counter_page.dart

    class CounterPage extends StatelessWidget {
        const CounterPage({super.key});

        @override
        Widget build(BuildContext context) {
            return Scaffold(
                appBar: AppBar(title: const Text('Counter')),
                body: BlocBuilder<CounterCubit, int>(
                    builder: (context, count) => Center(child: Text('$count')),
                ),
                floatingActionButton: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: <Widget>[
                        FloatingActionButton(
                            child: const Icon(Icons.add),
                            onPressed: () => context.read<CounterCubit>().increment(),
                        ),
                    const SizedBox(height: 4,),
                        FloatingActionButton(
                            child: const Icon(Icons.remove),
                            onPressed: () => context.read<CounterCubit>().decrement(),
                        ),
                    ],
                ),
            );
        }
    }
   ```

   > Now try to run it first to see if it working

   ![Run Test](@assets/images/what_is_cubit_bloc_and_how_to_test_it/1.png)

3. Establish a test for comprehensive coverage

   ```dart
   // test/counter_test.dart

   void main() {
       group('Test Start, Increment, Decrement', () {
           blocTest(
               'Test start, value must be 0',
               build: () => CounterCubit(),
               expect: () => [],
           );
           blocTest(
               'Increment once',
               build: () => CounterCubit(),
               act: (bloc) => bloc.increment(),
               expect: () => [1],
           );
           blocTest(
               'Increment many times',
               build: () => CounterCubit(),
               seed: () => 3,
               act: (bloc) => bloc.increment(),
               expect: () => [4],
           );
           blocTest(
               'Many state in one test',
               build: () => CounterCubit(),
               act: (bloc) {
                   bloc.increment();
                   bloc.increment();
                   bloc.increment();
                   bloc.decrement();
               },
               expect: () => [1, 2, 3 ,2],
           );
           blocTest(
               'Decrement, can not minus',
               build: () => CounterCubit(),
               act: (bloc) => bloc.decrement(),
               expect: () => [],
               // Since we disable -1, -2 etc. Keep the value 0
           );
       });
   }
   ```

   In the provided example from counter_test.dart, the blocTest function offers a straightforward and efficient approach to testing the behavior of the CounterCubit in different scenarios. The test suite is organized into a group focusing on the "Start, Increment, Decrement" operations. Each individual test case within the group utilizes the blocTest function to define the expected behavior.

4. Now, `flutter_test` will gave us result

   ![Test Result](@assets/images/what_is_cubit_bloc_and_how_to_test_it/2.png)

## Conclusion

In summary, exploring Flutter Cubit BLoC and its testing capabilities with bloc_test brings a straightforward and user-friendly approach to state management and unit testing in Flutter. Opting for Cubit over Bloc is driven by its simplicity in handling integer value modifications within the CounterCubit state. The introduction of bloc_test as a testing toolkit enhances the process, offering a user-friendly syntax and efficient testing support. The provided code snippets demonstrate dependency integration, application development, and the creation of comprehensive unit tests with clear and concise results. Mastering Cubit BLoC and bloc_test empowers Flutter developers to build robust applications with confidence, simplifying the development journey.

> In an upcoming post, I plan to discuss methods for preserving the state value.
