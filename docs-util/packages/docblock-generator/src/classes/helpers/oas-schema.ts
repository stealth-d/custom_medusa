import { OpenAPIV3 } from "openapi-types"
import { OpenApiSchema } from "../../types/index.js"
import Formatter from "./formatter.js"
import { join } from "path"
import { DOCBLOCK_LINE_ASTRIX } from "../../constants.js"
import ts from "typescript"
import getOasOutputBasePath from "../../utils/get-oas-output-base-path.js"
import { parse } from "yaml"
import formatOas from "../../utils/format-oas.js"
import pluralize from "pluralize"
import { wordsToPascal } from "../../utils/str-formatting.js"

type ParsedSchema = {
  schema: OpenApiSchema
  schemaPrefix: string
}

/**
 * Class providing helper methods for OAS Schemas
 */
class OasSchemaHelper {
  /**
   * This map collects schemas created while generating the OAS, then, once the generation process
   * finishes, it checks if it should be added to the base OAS document.
   */
  private schemas: Map<string, OpenApiSchema>
  protected schemaRefPrefix = "#/components/schemas/"
  protected formatter: Formatter
  /**
   * The path to the directory holding the base YAML files.
   */
  protected baseOutputPath: string

  constructor() {
    this.schemas = new Map()
    this.formatter = new Formatter()
    this.baseOutputPath = getOasOutputBasePath()
  }

  /**
   * Initialize the {@link schemas} property. Helpful when resetting the property.
   */
  init() {
    this.schemas = new Map()
  }

  /**
   * Retrieve schema as a reference object and add the schema to the {@link schemas} property.
   *
   * @param schema - The schema to convert and add to the schemas property.
   * @returns The schema as a reference. If the schema doesn't have the x-schemaName property set,
   * the schema isn't converted and `undefined` is returned.
   */
  schemaToReference(
    schema: OpenApiSchema
  ): OpenAPIV3.ReferenceObject | undefined {
    if (!schema["x-schemaName"]) {
      return
    }
    schema["x-schemaName"] = this.normalizeSchemaName(schema["x-schemaName"])

    // check if schema has child schemas
    // and convert those
    if (schema.properties) {
      Object.keys(schema.properties).forEach((property) => {
        if (
          "$ref" in schema.properties![property] ||
          !(schema.properties![property] as OpenApiSchema)["x-schemaName"]
        ) {
          return
        }

        schema.properties![property] =
          this.schemaToReference(
            schema.properties![property] as OpenApiSchema
          ) || schema.properties![property]
      })
    }

    this.schemas.set(schema["x-schemaName"], schema)

    return {
      $ref: this.constructSchemaReference(schema["x-schemaName"]),
    }
  }

  /**
   * Retrieve the expected file name of the schema.
   *
   * @param name - The schema's name
   * @returns The schema's file name
   */
  getSchemaFileName(name: string): string {
    return join(
      this.baseOutputPath,
      "schemas",
      `${this.normalizeSchemaName(name)}.ts`
    )
  }

  /**
   * Retrieve the schema by its name. If the schema is in the {@link schemas} map, it'll be retrieved from
   * there. Otherwise, the method will try to retrieve it from an outputted schema file, if available.
   *
   * @param name - The schema's name.
   * @returns The parsed schema, if found.
   */
  getSchemaByName(name: string): ParsedSchema | undefined {
    const schemaName = this.normalizeSchemaName(name)
    // check if it already exists in the schemas map
    if (this.schemas.has(schemaName)) {
      return {
        schema: this.schemas.get(schemaName)!,
        schemaPrefix: `@schema ${schemaName}`,
      }
    }
    const schemaFile = this.getSchemaFileName(schemaName)
    const schemaFileContent = ts.sys.readFile(schemaFile)

    if (!schemaFileContent) {
      return
    }

    return this.parseSchema(schemaFileContent)
  }

  /**
   * Parses a schema comment string.
   *
   * @param content - The schema comment string
   * @returns If the schema is valid and parsed successfully, the schema and its prefix are retrieved.
   */
  parseSchema(content: string): ParsedSchema | undefined {
    const schemaFileContent = content
      .replace(`/**\n`, "")
      .replaceAll(DOCBLOCK_LINE_ASTRIX, "")
      .replaceAll("*/", "")
      .trim()

    if (!schemaFileContent.startsWith("@schema")) {
      return
    }

    const splitContent = schemaFileContent.split("\n")
    const schemaPrefix = splitContent[0]
    let schema: OpenApiSchema | undefined

    try {
      schema = parse(splitContent.slice(1).join("\n"))
    } catch (e) {
      // couldn't parse the OAS, so consider it
      // not existent
    }

    return schema
      ? {
          schema,
          schemaPrefix,
        }
      : undefined
  }

  /**
   * Retrieve the normalized schema name. A schema's name must be normalized before saved.
   *
   * @param name - The original name.
   * @returns The normalized name.
   */
  normalizeSchemaName(name: string): string {
    return name.replace("DTO", "").replace(this.schemaRefPrefix, "")
  }

  /**
   * Construct a reference string to a schema.
   *
   * @param name - The name of the schema. For cautionary reasons, the name is normalized using the {@link normalizeSchemaName} method.
   * @returns The schema reference.
   */
  constructSchemaReference(name: string): string {
    return `${this.schemaRefPrefix}${this.normalizeSchemaName(name)}`
  }

  /**
   * Writes schemas in the {@link schemas} property to the file path retrieved using the {@link getSchemaFileName} method.
   */
  writeNewSchemas() {
    this.schemas.forEach((schema) => {
      if (!schema["x-schemaName"]) {
        return
      }
      const normalizedName = this.normalizeSchemaName(schema["x-schemaName"])
      const schemaFileName = this.getSchemaFileName(normalizedName)

      ts.sys.writeFile(
        schemaFileName,
        this.formatter.addCommentsToSourceFile(
          formatOas(schema, `@schema ${normalizedName}`),
          ""
        )
      )
    })
  }

  /**
   * Checks whether an object is a reference object.
   *
   * @param schema - The schema object to check.
   * @returns Whether the object is a reference object.
   */
  isRefObject(
    schema:
      | OpenAPIV3.ReferenceObject
      | OpenApiSchema
      | OpenAPIV3.RequestBodyObject
      | OpenAPIV3.ResponseObject
      | undefined
  ): schema is OpenAPIV3.ReferenceObject {
    return schema !== undefined && "$ref" in schema
  }

  /**
   * Converts a tag name to a schema name. Can be used to try and retrieve the schema
   * associated with a tag.
   *
   * @param tagName - The name of the tag.
   * @returns The possible name of the associated schema.
   */
  tagNameToSchemaName(tagName: string): string {
    return wordsToPascal(pluralize.singular(tagName))
  }
}

export default OasSchemaHelper
